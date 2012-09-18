using System;
using Toodeloo.WinRT.Infrastructure.Execution.Activation;

namespace Toodeloo.WinRT.Infrastructure.Execution.Binding
{
	public interface IBinding
	{
		Type Service { get; }
		Type Target { get; }
		IStrategy Strategy { get; }
		IScope Scope { get; set; }
	}
}