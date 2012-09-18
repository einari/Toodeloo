using System.Linq;
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

        ItemSelected    ItemSelectedMessage = new ItemSelected();

        IToDoService _toDoService;
        ISearchService _searchService;
        IMessenger _messenger;
        IDispatcher _dispatcher;
        ToDoItem _selectedItem;

        public ListViewModel(
            IToDoService toDoService, 
            IMessenger messenger, 
            IDispatcher dispatcher,
            ISearchService searchService
            )
        {
            _toDoService = toDoService;
            _searchService = searchService;
            _dispatcher = dispatcher;
            _messenger = messenger;

            Items = new ObservableCollection<ToDoItem>();
            SearchResult = new ObservableCollection<ToDoItem>();

            RegisterSubscriptions();
            SetupCommands();
            
            Items.CollectionChanged += (s, c) =>
            {
                var count = Items.Count;
                Count = count;
                messenger.Send(new ItemCountChanged { Count = count });
            };
            PopulateItems();
        }

        private void SetupCommands()
        {
            RefreshCommand = DelegateCommand.Create(Refresh);
            DeleteCommand = DelegateCommand.Create(Delete);
            ClearSearchCommand = DelegateCommand.Create(ClearSearch);
        }

        private void RegisterSubscriptions()
        {
            _messenger.Register<ItemAdded>(this, message => Items.Add(new ToDoItem { Title = message.Title }));
            _messenger.Register<SearchQuery>(this, PerformSearch);
        }

        public ObservableCollection<ToDoItem> Items { get; private set; }
        public ObservableCollection<ToDoItem> SearchResult { get; private set; }
        public ToDoItem SelectedItem 
        { 
            get { return _selectedItem; }
            set 
            { 
                _selectedItem = value; 
                ItemSelectedMessage.Item = value;
                _messenger.Send(ItemSelectedMessage);
            }
        }
        
        public string SearchQuery { get; set; }

        public int Count { get; set; }

        public ICommand RefreshCommand { get; private set; }
        public ICommand DeleteCommand { get; private set; }
        public ICommand ClearSearchCommand { get; private set; }

        async void PopulateItems()
        {
            var items = await _toDoService.GetAllAsync();
            _dispatcher.BeginInvoke(() =>
            {
                foreach (var item in items)
                    Items.Add(item);
            });
        }

        void PerformSearch(SearchQuery message)
        {
            SearchQuery = message.Query;
            SearchResult.Clear();
            if (string.IsNullOrEmpty(message.Query))
                return;
            var filtered = _searchService.GetResultFrom(message.Query);
            foreach (var item in filtered)
                SearchResult.Add(item);
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

        void ClearSearch()
        {
            SearchQuery = string.Empty;
            SearchResult.Clear();
        }
    }
}
