namespace Toodeloo.Web.vNext.Services
{
    public interface IPushService
    {
        void RegisterClient(string url);
        void PushNewItem(string title);
    }
}
