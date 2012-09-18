
namespace Toodeloo.WinRT.Services
{
    public interface INotificationService
    {
        void SendTileMessage(string message);
        void SendToastMessage(string message);
        void SetBadgeCount(int count);
    }
}
