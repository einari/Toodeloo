using System;
using Toodeloo.WinRT.Execution.Activation;

namespace Toodeloo.WinRT.Execution.Binding
{
	public interface IBinding
	{
		Type Service { get; }
		Type Target { get; }
		IStrategy Strategy { get; }
		IScope Scope { get; set; }
	}
}