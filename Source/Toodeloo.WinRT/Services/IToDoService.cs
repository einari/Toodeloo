using System.Collections.Generic;
using System.Threading.Tasks;

namespace Toodeloo.WinRT.Services
{
    public interface IToDoService
    {
        Task<IEnumerable<ToDoItem>> GetAllAsync();
        void AddItem(string title);
        void DeleteItem(ToDoItem item);
    }
}
