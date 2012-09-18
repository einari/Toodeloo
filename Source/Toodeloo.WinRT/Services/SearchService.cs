using System.Collections.Generic;
using System.Linq;
using Toodeloo.WinRT.Infrastructure.Execution;

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
    }
}
