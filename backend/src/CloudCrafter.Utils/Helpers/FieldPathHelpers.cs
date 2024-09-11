using System.Linq.Expressions;

namespace CloudCrafter.Utils.Helpers;

public static class FieldPathHelpers<T>
{
    private static MemberExpression UnwrapExpression(Expression expression)
    {
        return expression switch
        {
            UnaryExpression unaryExpression => UnwrapExpression(unaryExpression.Operand),
            MemberExpression memberExpression => memberExpression,
            _ => throw new NotSupportedException($"Unsupported expression type {expression.Type}"),
        };
    }

    public static string GetFieldPath<TM>(
        Expression<Func<T, TM>> propertyExpression,
        char separator
    )
    {
        var expr = UnwrapExpression(propertyExpression.Body);
        return GetMemberPathString(expr, separator);
    }

    public static string GetFieldPath<TM>(Expression<Func<T, TM>> propertyExpression)
    {
        return GetFieldPath(propertyExpression, '.');
    }

    private static string GetMemberPathString(MemberExpression expr, char separator) =>
        expr.Expression switch
        {
            MemberExpression memberExpr => GetMemberPathString(memberExpr, separator)
                + separator
                + expr.Member.Name,
            _ => expr.Member.Name,
        };
}
