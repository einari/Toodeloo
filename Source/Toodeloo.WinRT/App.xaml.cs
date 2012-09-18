using GalaSoft.MvvmLight.Messaging;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using Toodeloo.WinRT.Features.Contracts;
using Toodeloo.WinRT.Infrastructure.Execution;
using Toodeloo.WinRT.Services;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.ApplicationModel.DataTransfer;
using Windows.Networking.PushNotifications;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

namespace Toodeloo.WinRT
{
    sealed partial class App : Application
    {
        public static IContainer Container { get; private set; }
        public static ISearchService SearchService { get; private set; }
        public static IApplicationService ApplicationService { get; private set; }
        public static INotificationService NotificationService { get; private set; }
        public static ISharingService SharingService { get; private set; }

        static App()
        {
            Container = ContainerContext.Current;
            Container.Register<IMessenger>(Messenger.Default);

            NotificationService = Container.Get<INotificationService>();
            ApplicationService = Container.Get<IApplicationService>();
            SharingService = Container.Get<ISharingService>();
        }

        public App()
        {
            this.InitializeComponent();
            this.Suspending += OnSuspending;
        }

        
        protected override void OnShareTargetActivated(ShareTargetActivatedEventArgs args)
        {
            var view = new ShareTarget();
            view.ShareOperation = args.ShareOperation;
            GetTextFromShare(view, args);
            Window.Current.Content = view;
            Window.Current.Activate();
            base.OnShareTargetActivated(args);
        }

        async void GetTextFromShare(ShareTarget target, ShareTargetActivatedEventArgs args)
        {

            if (args.ShareOperation.Data.Contains(StandardDataFormats.Text))
            {
                var text = await args.ShareOperation.Data.GetTextAsync();
                target.Title = text;
            }
        }

        protected override void OnLaunched(LaunchActivatedEventArgs args)
        {
            Container.Register<IDispatcher>(new Dispatcher(Window.Current.Dispatcher));
            var viewModelLocator = Resources["ViewModelLocator"] as ViewModelLocator;
            viewModelLocator.Initialize();


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


            var rootFrame = Window.Current.Content as Frame;

            if (rootFrame == null)
            {
                rootFrame = new Frame();
                if (args.PreviousExecutionState == ApplicationExecutionState.Terminated)
                    ApplicationService.Resume();

                Window.Current.Content = rootFrame;
            }

            if (rootFrame.Content == null)
                if (!rootFrame.Navigate(typeof(MainPage), args.Arguments))
                    throw new Exception("Failed to create initial page");

            SharingService.Initialize();
            Window.Current.Activate();
        }

        private void OnSuspending(object sender, SuspendingEventArgs e)
        {
            var deferral = e.SuspendingOperation.GetDeferral();
            ApplicationService.Suspend();
            deferral.Complete();
        }

        protected async override void OnSearchActivated(Windows.ApplicationModel.Activation.SearchActivatedEventArgs args)
        {
            SearchService.PerformSearch(args.QueryText);
        }
    }
}
