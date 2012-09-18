using GalaSoft.MvvmLight.Messaging;
using System;
using System.Linq;
using Toodeloo.WinRT.Features.Content;
using Toodeloo.WinRT.Features.Contracts;
using Toodeloo.WinRT.Infrastructure.Execution;
using Toodeloo.WinRT.Messages;
using Toodeloo.WinRT.Services;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.ApplicationModel.DataTransfer;
using Windows.ApplicationModel.Search;
using Windows.UI.Popups;
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

        static App()
        {
            Container = ContainerContext.Current;
            Container.Register<IMessenger>(Messenger.Default);

            NotificationService = Container.Get<INotificationService>();
            ApplicationService = Container.Get<IApplicationService>();
        }

        public App()
        {
            this.InitializeComponent();
            this.Suspending += OnSuspending;
        }

        protected override void OnShareTargetActivated(ShareTargetActivatedEventArgs args)
        {
            var view = new ShareTarget();
            Window.Current.Content = view;
            Window.Current.Activate();
            base.OnShareTargetActivated(args);
        }

        async void GetTextFromShare(ShareTargetActivatedEventArgs args)
        {
            if (args.ShareOperation.Data.Contains(StandardDataFormats.Text))
            {
                var text = await args.ShareOperation.Data.GetTextAsync();
                
                
                

                var i = 0;
                i++;

            }
        }

        protected override void OnLaunched(LaunchActivatedEventArgs args)
        {
            Container.Register<IDispatcher>(new Dispatcher(Window.Current.Dispatcher));
            var viewModelLocator = Resources["ViewModelLocator"] as ViewModelLocator;
            viewModelLocator.Initialize();

            var dataTransferManager = DataTransferManager.GetForCurrentView();
            dataTransferManager.DataRequested += dataTransferManager_DataRequested;

            Frame rootFrame = Window.Current.Content as Frame;

            if (rootFrame == null)
            {
                rootFrame = new Frame();

                if (args.PreviousExecutionState == ApplicationExecutionState.Terminated)
                    ApplicationService.Resume();

                Window.Current.Content = rootFrame;
            }

            if (rootFrame.Content == null)
            {
                if (!rootFrame.Navigate(typeof(MainPage), args.Arguments))
                {
                    throw new Exception("Failed to create initial page");
                }
            }
            Window.Current.Activate();
        }

        void dataTransferManager_DataRequested(DataTransferManager sender, DataRequestedEventArgs args)
        {
            args.Request.Data.Properties.Title = "Sample sharing source";
            args.Request.Data.Properties.Description = "This is the shit";
            args.Request.Data.SetText("Something to share");
        }

  
        private void OnSuspending(object sender, SuspendingEventArgs e)
        {
            var deferral = e.SuspendingOperation.GetDeferral();

            ApplicationService.Suspend();

            deferral.Complete();
        }

        /// <summary>
        /// Invoked when the application is activated to display search results.
        /// </summary>
        /// <param name="args">Details about the activation request.</param>
        protected async override void OnSearchActivated(Windows.ApplicationModel.Activation.SearchActivatedEventArgs args)
        {
            SearchService.PerformSearch(args.QueryText);
        }
    }
}
