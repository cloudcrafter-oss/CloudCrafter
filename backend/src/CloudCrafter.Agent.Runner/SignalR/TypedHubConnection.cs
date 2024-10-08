using System.Linq.Expressions;
using Microsoft.AspNetCore.SignalR.Client;

namespace CloudCrafter.Agent.Runner.SignalR;

public class TypedHubConnection<THub>(HubConnection connection)
    where THub : class
{
    public Task InvokeAsync<TResult>(Expression<Func<THub, Task<TResult>>> methodExpression)
    {
        var (methodName, args) = ExtractMethodInfo(methodExpression);
        return connection.InvokeAsync<TResult>(methodName, args);
    }

    public Task InvokeAsync(Expression<Func<THub, Task>> methodExpression)
    {
        var (methodName, args) = ExtractMethodInfo(methodExpression);
        return connection.InvokeAsync(methodName, args?[0]);
    }

    public bool IsConnected()
    {
        return connection.State == HubConnectionState.Connected;
    }

    private (string MethodName, object?[] Args) ExtractMethodInfo(LambdaExpression methodExpression)
    {
        if (methodExpression.Body is MethodCallExpression methodCallExpression)
        {
            var methodName = methodCallExpression.Method.Name;
            var args = methodCallExpression
                .Arguments.Select(arg =>
                {
                    var constantExpression = arg as ConstantExpression;
                    if (constantExpression != null)
                    {
                        return constantExpression.Value;
                    }
                    var lambda = Expression.Lambda(arg);
                    return lambda.Compile().DynamicInvoke();
                })
                .ToArray();

            return (methodName, args);
        }
        throw new ArgumentException("Expression must be a method call.");
    }
}
