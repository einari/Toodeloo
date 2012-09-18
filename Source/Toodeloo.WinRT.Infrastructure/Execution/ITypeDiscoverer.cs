using System;

namespace Toodeloo.WinRT.Infrastructure.Execution
{
	/// <summary>
	/// Discovers types based upon basetypes
	/// </summary>
	public interface ITypeDiscoverer
	{
		/// <summary>
		/// Find a single implementation of a basetype
		/// </summary>
		/// <typeparam name="T">Basetype to find for</typeparam>
		/// <returns>Type found</returns>
		/// <remarks>
		/// If the base type is an interface, it will look for any types implementing the interface.
		/// If it is a class, it will find anyone inheriting from that class
		/// </remarks>
		/// <exception cref="ArgumentException">If there is more than one instance found</exception>
		Type FindSingle<T>();

		/// <summary>
		/// Find multiple implementations of a basetype
		/// </summary>
		/// <typeparam name="T">Basetype to find for</typeparam>
		/// <returns>All types implementing or inheriting from the given basetype</returns>
		/// <remarks>
		/// If the base type is an interface, it will look for any types implementing the interface.
		/// If it is a class, it will find anyone inheriting from that class
		/// </remarks>
		Type[] FindMultiple<T>();
	}
}