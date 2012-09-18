using System;
using GalaSoft.MvvmLight.Messaging;
using Newtonsoft.Json;
using Toodeloo.WinRT.Infrastructure.Messages;
using Windows.Networking.PushNotifications;
using Windows.UI.Notifications;
using System.Net.Http;
using System.Text;

namespace Toodeloo.WinRT.Services
{
    public class NotificationService : INotificationService
    {
        IMessenger _messenger;

        public NotificationService(IMessenger messenger)
        {
            _messenger = messenger;
            SubscribeToCountChanges();

            RegisterClient();
        }

        public void ClearTileMessages()
        {
            TileUpdateManager.CreateTileUpdaterForApplication().Clear();
        }


        public void RegisterClient()
        {
            var channel = PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            channel.AsTask<PushNotificationChannel>().ContinueWith(
                async t =>
                {
                    var uri = t.Result.Uri;

                    //var url = "http://localhost2:1462/Push/RegisterClient";
                    var url = "http://toodeloo.dolittle.com/Push/RegisterClient";
                    var client = new HttpClient();
                    var json = JsonConvert.SerializeObject(new { url = uri });
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    await client.PostAsync(url, content);
                });
        }

        public void SendTileMessage(string message)
        {
            var content = TileUpdateManager.GetTemplateContent(TileTemplateType.TileWideText03);
            var textElements = content.GetElementsByTagName("text");
            textElements.Item(0).AppendChild(content.CreateTextNode(message));
            var notification = new TileNotification(content);
            TileUpdateManager.CreateTileUpdaterForApplication().Update(notification);
        }

        public void SendToastMessage(string message)
        {
            var content = ToastNotificationManager.GetTemplateContent(ToastTemplateType.ToastImageAndText01);
            var textElements = content.GetElementsByTagName("text");
            textElements.Item(0).AppendChild(content.CreateTextNode(message));
            var notification = new ToastNotification(content);
            ToastNotificationManager.CreateToastNotifier().Show(notification);
        }

        public void SetBadgeCount(int count)
        {
            var template = BadgeUpdateManager.GetTemplateContent(BadgeTemplateType.BadgeNumber);
            var badgeNode = template.GetElementsByTagName("badge");
            badgeNode[0].Attributes[0].NodeValue = count.ToString();
            var notification = new BadgeNotification(template);
            BadgeUpdateManager.CreateBadgeUpdaterForApplication().Update(notification);
        }

        void SubscribeToCountChanges()
        {
            _messenger.Register<ItemCountChanged>(this, message => SetBadgeCount(message.Count));
        }
    }
}
