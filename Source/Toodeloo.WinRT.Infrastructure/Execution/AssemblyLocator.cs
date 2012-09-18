using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Windows;
using Windows.Foundation;
using Windows.Storage;
using Windows.Storage.Search;

namespace Toodeloo.WinRT.Execution
{
	public class AssemblyLocator : IAssemblyLocator
	{
		List<Assembly>	_assemblies = new List<Assembly>();

		public AssemblyLocator()
		{
			CollectAssemblies();
		}


		public IEnumerable<Assembly> GetAll()
		{
			return _assemblies;
		}

#if(WINDOWS_PHONE)
        private void CollectAssemblies()
        {
            if (null != Deployment.Current)
            {
                var parts = Deployment.Current.Parts;
                foreach (var part in parts)
                {
                    var assemblyName = part.Source.Replace(".dll", string.Empty);
                    _assemblies.Add(Assembly.Load(assemblyName);
                }
            }
        }
#else

#if(SILVERLIGHT)
        private void CollectAssemblies()
		{
			if (Deployment.Current != null)
			{
				var parts = Deployment.Current.Parts;
				foreach (var part in parts.Where(part => ShouldAddAssembly(part.Source)))
				{
					var info = Application.GetResourceStream(new Uri(part.Source, UriKind.Relative));
					_assemblies.Add(part.Load(info.Stream));
				}
			}
		}

#else
#if(NETFX_CORE)
        private void CollectAssemblies()
        {
            var folder = Windows.ApplicationModel.Package.Current.InstalledLocation;
            var assemblies = new List<Assembly>();

            IEnumerable<StorageFile>    files = null;

            var operation = folder.GetFilesAsync();
            operation.Completed = async (r, s) => {
                var result = await r;
                files = result;
            };

            while (files == null) ;

            foreach (var file in files)
            {
                if (file.FileType == ".dll" || file.FileType == ".exe")
                {
                    var name = new AssemblyName() { Name = System.IO.Path.GetFileNameWithoutExtension(file.Name) };
                    try
                    {
                        Assembly asm = Assembly.Load(name);
                        assemblies.Add(asm);
                    }
                    catch { }
                }
            }
            _assemblies.AddRange(assemblies);
        }
#else

		private void CollectAssemblies()
		{
			var assemblies = AppDomain.CurrentDomain.GetAssemblies();
			var query = from a in assemblies
						where ShouldAddAssembly(a.FullName)
						select a;

			_assemblies.AddRange(query);
		}
#endif
#endif
#endif
		private static bool ShouldAddAssembly(string name)
		{
			return !name.Contains("System.");
		}

	}
}