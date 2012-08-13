using System.Configuration;
using System.Web.Routing;
using Bifrost.Configuration;
using Bifrost.Execution;
using Bifrost.Ninject;
using Bifrost.Services.Execution;
using Bifrost.Web;
using Ninject;

namespace Toodeloo.Web.vNext
{
    public class Global : BifrostHttpApplication
    {
        public override void OnStarted()
        {
            RouteTable.Routes.AddService<Services.ToDoItemService>();
            base.OnStarted();
        }


        public override void OnConfigure(IConfigure configure)
        {

			var connectionString = ConfigurationManager.AppSettings["MONGOHQ_URL"];
			var database = ConfigurationManager.AppSettings["MONGO_DB"];

            configure
                .UsingConfigConfigurationSource()
                .Sagas.WithoutLibrarian()
                .Serialization.UsingJson()
                .UsingMongoDb(connectionString, database)
                .AsSinglePageApplication();
            base.OnConfigure(configure);
        }

        protected override IContainer CreateContainer()
        {
            var kernel = new StandardKernel();
            var container = new Container(kernel);
            return container;
        }
    }
}
