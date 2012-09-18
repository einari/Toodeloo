using GalaSoft.MvvmLight.Messaging;
using System.ComponentModel;
using Toodeloo.WinRT.Infrastructure.Messages;

namespace Toodeloo.WinRT.Features.Content
{
    public class IndexViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;


        public IndexViewModel(IMessenger messenger)
        {
            messenger.Register<ItemCountChanged>(this, (message) => Count = message.Count);
        }

        public int Count { get; set; }
    }
}
