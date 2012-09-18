using System.Windows;
using Windows.UI.Xaml;

namespace Toodeloo.WinRT.Infrastructure.Input
{
	public interface ICanExecuteCommand
	{
		event RoutedEventHandler Command;
	}
}
