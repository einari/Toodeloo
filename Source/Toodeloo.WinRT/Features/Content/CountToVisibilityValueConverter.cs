using System;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Data;

namespace Toodeloo.WinRT.Features.Content
{
    public class CountToVisibilityValueConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            var reverse = false;
            if (null != parameter)
                reverse = bool.TryParse(parameter.ToString(), out reverse);

            var result = ((((IComparable)value).CompareTo(0) == 0)^reverse);
            return result ? Visibility.Visible : Visibility.Collapsed;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            throw new NotImplementedException();
        }
    }
}
