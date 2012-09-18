using Newtonsoft.Json;
using NotificationsExtensions;
using NotificationsExtensions.ToastContent;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;

namespace Toodeloo.Web.vNext.Services
{
    public class PushService : IPushService
    {
        WnsAccessTokenProvider _tokenProvider;
        static List<string> _clientUrls = new List<string>();

        public PushService()
        {
            var packageSid = "ms-app://s-1-15-2-1365235042-3950292793-1450507326-4003872592-2110243094-239169135-4162116563";
            var secret = "P00x4b78vxQnaN799gyPJgbdbffRyJZ7";
            _tokenProvider = new WnsAccessTokenProvider(packageSid, secret);

            LoadClients();
        }

        public void RegisterClient(string url)
        {
            if (_clientUrls.Contains(url))
                return;

            _clientUrls.Add(url);
            SaveClients();
        }

        public void PushNewItem(string title)
        {
            foreach (var url in _clientUrls)
            {
                var notification = ToastContentFactory.CreateToastText01();
                notification.TextBodyWrap.Text = title;

                var result = notification.Send(new Uri(url), _tokenProvider);
            }
        }

        string GetFilename()
        {
            var path = HttpContext.Current.Server.MapPath("~/Data");
            return path + "\\clients.json";
        }

        void LoadClients()
        {
            var filename = GetFilename();
            if (File.Exists(filename))
            {
                var content = File.ReadAllText(filename);
                var clients = JsonConvert.DeserializeObject<IEnumerable<string>>(content);
                _clientUrls.Clear();
                _clientUrls.AddRange(clients);
            }
        }

        void SaveClients()
        {
            var filename = GetFilename();
            var json = JsonConvert.SerializeObject(_clientUrls);
            File.WriteAllText(filename, json);
        }
    }
}