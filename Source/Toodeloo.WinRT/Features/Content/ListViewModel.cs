using GalaSoft.MvvmLight.Messaging;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;
using Toodeloo.WinRT.Infrastructure.Execution;
using Toodeloo.WinRT.Infrastructure.Input;
using Toodeloo.WinRT.Infrastructure.Messages;
using Toodeloo.WinRT.Messages;
using Toodeloo.WinRT.Services;

namespace Toodeloo.WinRT.Features.Content
{
    public class ListViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        IToDoService _toDoService;
        IDispatcher _dispatcher;

        public ListViewModel(IToDoService toDoService, IMessenger messenger, IDispatcher dispatcher)
        {
            _toDoService = toDoService;
            _dispatcher = dispatcher;

            messenger.Register<ItemAdded>(this, message => Items.Add(new ToDoItem { Title = message.Title }));

            RefreshCommand = DelegateCommand.Create(Refresh);
            DeleteCommand = DelegateCommand.Create(Delete);

            Items = new ObservableCollection<ToDoItem>();
            Items.CollectionChanged += (s, c) => messenger.Send(new ItemCountChanged { Count = Items.Count });
            PopulateItems();
        }

        public ObservableCollection<ToDoItem> Items { get; private set; }
        public ToDoItem SelectedItem { get; set; }

        public ICommand RefreshCommand { get; private set; }
        public ICommand DeleteCommand { get; private set; }

        async void PopulateItems()
        {
            var items = await _toDoService.GetAllAsync();
            _dispatcher.BeginInvoke(() =>
            {
                foreach (var item in items)
                    Items.Add(item);
            });
        }


        void Refresh()
        {
            Items.Clear();
            PopulateItems();
        }

        void Delete()
        {
            if (SelectedItem != null)
            {
                _toDoService.DeleteItem(SelectedItem);
                Items.Remove(SelectedItem);
            }
        }
    }
}
