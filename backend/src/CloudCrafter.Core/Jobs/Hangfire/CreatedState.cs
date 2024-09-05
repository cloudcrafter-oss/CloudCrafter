using Hangfire.States;

namespace CloudCrafter.Core.Jobs.Hangfire;

public class CreatedState : IState
{
    public Dictionary<string, string> SerializeData()
    {
        return new Dictionary<string, string>();
    }

    public string Name => "Cloudcrafter Created";
    public string Reason => "Job just got created and waiting to be persisted in the database";
    public bool IsFinal => false;
    public bool IgnoreJobLoadException => false;
}
