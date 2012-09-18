using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Toodeloo.WinRT.Services
{
    public class ToDoService : IToDoService
    {
        const   string baseUrl = "http://toodeloo.dolittle.com/ToDoItem";

        ISearchService _searchService;

        public ToDoService(ISearchService searchService)
        {
            _searchService = searchService;
        }

        public async Task<IEnumerable<ToDoItem>> GetAllAsync()
        {
            var url = baseUrl+"/GetAll";
            var client = new HttpClient();
            var response = await client.GetStringAsync(url);
            var items = JsonConvert.DeserializeObject<IEnumerable<ToDoItem>>(response);
            _searchService.SetItemsForIndex(items);
            return items;
        }

        public async void AddItem(string title)
        {
            var url = baseUrl + "/Add";
            var client = new HttpClient();
            var json = JsonConvert.SerializeObject(new { title = title });
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            _searchService.AddItemToIndex(new ToDoItem { Title = title });
            await client.PostAsync(url, content);
        }

        public async void DeleteItem(ToDoItem item)
        {
            var url = baseUrl+"/Remove";
            var client = new HttpClient();
            var json = JsonConvert.SerializeObject(new { id = item.Id });
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            _searchService.RemoveItemFromIndex(item);
            await client.PostAsync(url, content);
        }
    }
}
