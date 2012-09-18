using System;
using System.Collections.Generic;
using System.Linq;

namespace Toodeloo.WinRT.Infrastructure.Execution.Activation
{
	public class ActivationManager : IActivationManager
	{
		readonly ITypeDiscoverer _discoverer;
		readonly IStrategyActivator _strategyActivator;
		readonly List<IStrategy> _strategies = new List<IStrategy>();

		public ActivationManager(ITypeDiscoverer discoverer, IStrategyActivator strategyActivator)
		{
			_discoverer = discoverer;
			_strategyActivator = strategyActivator;
		}

		void DiscoverStrategies()
		{
			var strategyTypes = _discoverer.FindMultiple<IStrategy>();
            foreach (var strategyType in strategyTypes)
            {
                var instance = _strategyActivator.GetInstance(strategyType);
                if (instance != null)
                {
                    _strategies.Add(instance);
                }
            }
		}

		public IStrategy GetStrategyFor(Type type)
		{
			if( _strategies.Count == 0 )
				DiscoverStrategies();

			var strategy = _strategies.Where(s => s.CanActivate(type)).SingleOrDefault();
			return strategy;
		}
	}
}