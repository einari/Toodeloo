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
            RouteTable.Routes.AddService<Services.PushService>();
            base.OnStarted();
        }


        public override void OnConfigure(IConfigure configure)
        {
            var connectionString = ConfigurationManager.AppSettings["MONGOHQ_URL"]; // "mongodb://appharbor:27285b33889ab6e96bac73e53011e376@alex.mongohq.com:10046/61454f3e_9890_48bb_8a1e_e0fc0127a648";
            var database = ConfigurationManager.AppSettings["MONGO_DB"];// "61454f3e_9890_48bb_8a1e_e0fc0127a648"; 

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
