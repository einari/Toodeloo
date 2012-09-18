using Toodeloo.WinRT.Services;
using Windows.ApplicationModel.DataTransfer.ShareTarget;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace Toodeloo.WinRT.Features.Contracts
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class ShareTarget : Page
    {
        public ShareTarget()
        {
            this.InitializeComponent();
        }

        public ShareOperation ShareOperation { get; set; }
        public string Title 
        {
            get { return TitleTextBox.Text; }
            set { TitleTextBox.Text = value; }
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }

        void AddClick(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(Title))
            {
                ShareOperation.ReportStarted();

                var toDoService = App.Container.Get<IToDoService>();
                toDoService.AddItem(Title);

                ShareOperation.ReportCompleted();
            }
        }
    }
}
