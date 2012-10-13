using GalaSoft.MvvmLight.Messaging;
using System.Collections.Generic;
using System.Linq;
using Toodeloo.WinRT.Messages;
using Windows.ApplicationModel.Search;
using Yggdrasil;

namespace Toodeloo.WinRT.Services
{
    [Singleton]
    public class SearchService : ISearchService
    {
        List<ToDoItem> _index = new List<ToDoItem>();

        public void SetItemsForIndex(IEnumerable<ToDoItem> items)
        {
            _index.Clear();
            _index.AddRange(items);
        }

        public IEnumerable<ToDoItem> GetResultFrom(string query)
        {
            var filtered = _index.Where(i => i.Title.ToLowerInvariant().Contains(query.ToLowerInvariant()));
            return filtered;
        }

        public IEnumerable<string> GetSuggestionsFrom(string query)
        {
            return GetResultFrom(query).Select(i => i.Title);
        }


        public void AddItemToIndex(ToDoItem item)
        {
            _index.Add(item);
        }

        public void RemoveItemFromIndex(ToDoItem item)
        {
            _index.Remove(item);
        }

        public void Initialize()
        {
            var searchPane = SearchPane.GetForCurrentView();
            searchPane.SuggestionsRequested += SuggestionsRequested;
        }

        void SuggestionsRequested(SearchPane sender, SearchPaneSuggestionsRequestedEventArgs args)
        {
            var result = GetSuggestionsFrom(args.QueryText).Take(5);
            foreach (var suggestion in result)
                args.Request.SearchSuggestionCollection.AppendQuerySuggestion(suggestion);
        }


        public void PerformSearch(string query)
        {
            Messenger.Default.Send(new SearchQuery { Query = query });
        }
    }
}
