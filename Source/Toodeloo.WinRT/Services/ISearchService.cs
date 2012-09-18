using System.Collections.Generic;
namespace Toodeloo.WinRT.Services
{
    public interface ISearchService
    {
        void Initialize();
        void PerformSearch(string query);
        void SetItemsForIndex(IEnumerable<ToDoItem> items);
        void AddItemToIndex(ToDoItem item);
        void RemoveItemFromIndex(ToDoItem item);
        IEnumerable<ToDoItem> GetResultFrom(string query);
        IEnumerable<string> GetSuggestionsFrom(string query);
    }
}
