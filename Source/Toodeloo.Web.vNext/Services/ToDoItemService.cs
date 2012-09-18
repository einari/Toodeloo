using System;
using System.Linq;
using System.Collections.Generic;
using Bifrost.Entities;

namespace Toodeloo.Web.vNext.Services
{
    public class ToDoItemService
    {
        IEntityContext<ToDoItem> _entityContext;
        IPushService _pushService;

        public ToDoItemService(IEntityContext<ToDoItem> entityContext, IPushService pushService)
        {
            _entityContext = entityContext;
            _pushService = pushService;
        }


        public IEnumerable<ToDoItem> GetAll()
        {
            return _entityContext.Entities.ToArray();
        }

        public void Add(string title)
        {
            _entityContext.Insert(new ToDoItem
            {
                Id = Guid.NewGuid(),
                Title = title
            });
            _pushService.PushNewItem(title);
        }

        public void Remove(string id)
        {
            var guid = Guid.Parse(id);
            var entity = _entityContext.Entities.Where(e => e.Id == guid).SingleOrDefault();
            _entityContext.Delete(entity);
        }
    }
}