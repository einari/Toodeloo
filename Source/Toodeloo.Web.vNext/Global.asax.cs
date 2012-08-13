using System.Web.Routing;
using Bifrost.Configuration;
using Bifrost.Execution;
using Bifrost.Ninject;
using Bifrost.Services.Execution;
using Bifrost.Web.Mvc;
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
            configure
                .UsingConfigConfigurationSource()
                .Sagas.WithoutLibrarian()
                .Serialization.UsingJson()
                .UsingMongoDb("mongodb://10.0.1.49","Toodeloo")
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
