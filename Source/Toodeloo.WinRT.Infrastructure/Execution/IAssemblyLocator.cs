using System.Collections.Generic;
using System.Reflection;

namespace Toodeloo.WinRT.Execution
{
	public interface IAssemblyLocator
	{
		IEnumerable<Assembly> GetAll();
	}
}