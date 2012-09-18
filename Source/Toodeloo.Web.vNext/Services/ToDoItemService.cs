using System;
using System.Linq;
using System.Collections.Generic;
using Bifrost.Entities;
using MongoDB.Driver;
using MongoDB.Bson.Serialization;
using System.Configuration;
using MongoDB.Bson;

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

            var connectionString = ConfigurationManager.AppSettings["MONGOHQ_URL"];
            var databaseString = ConfigurationManager.AppSettings["MONGO_DB"];

            var server = MongoServer.Create(connectionString);
            var database = server.GetDatabase(databaseString);
            var collection = database.GetCollection<ToDoItem>(typeof(ToDoItem).Name);

            var classMap = BsonClassMap<ToDoItem>.LookupClassMap(typeof(ToDoItem)) as BsonClassMap<ToDoItem>;
            var actualId = classMap.IdMemberMap.Getter(entity);
            var bsonId = BsonValue.Create(actualId);
            var query = new QueryDocument(classMap.IdMemberMap.ElementName, bsonId);
            collection.Remove(query);
        }
    }
}