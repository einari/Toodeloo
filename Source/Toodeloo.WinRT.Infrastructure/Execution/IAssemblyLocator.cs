using System.Collections.Generic;
using System.Reflection;

namespace Toodeloo.WinRT.Infrastructure.Execution
{
	public interface IAssemblyLocator
	{
		IEnumerable<Assembly> GetAll();
	}
}