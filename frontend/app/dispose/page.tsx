export default function DisposePage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
        <a
          href="/dashboard"
          className="text-2xl font-bold text-green-700"
        >
          🌱 EcoSort
        </a>

        <a
          href="/dashboard"
          className="text-gray-600 hover:text-green-600"
        >
          ← Back to Dashboard
        </a>
      </nav>


      {/* Page Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <h2 className="text-3xl font-bold text-gray-900">
            Dispose Waste
          </h2>

          <p className="mt-2 text-gray-600">
            Record your waste disposal and earn EcoPoints.
          </p>


          {/* Waste Type */}
          <div className="mt-8">
            <label className="mb-2 block font-medium text-gray-700">
              Waste Type
            </label>

            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              defaultValue=""
            >
              <option value="" disabled>
                Select waste type
              </option>

              <option value="plastic">Plastic</option>
              <option value="paper">Paper</option>
              <option value="glass">Glass</option>
              <option value="metal">Metal</option>
              <option value="cardboard">Cardboard</option>
              <option value="other">Other</option>
            </select>
          </div>


          {/* Quantity */}
          <div className="mt-6">
            <label className="mb-2 block font-medium text-gray-700">
              Quantity (kg)
            </label>

            <input
              type="number"
              placeholder="Enter quantity"
              min="0"
              step="0.1"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>


          {/* Bin */}
          <div className="mt-6">
            <label className="mb-2 block font-medium text-gray-700">
              Select Bin
            </label>

            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              defaultValue=""
            >
              <option value="" disabled>
                Select a nearby bin
              </option>

              <option value="bin1">
                EcoSort Bin - Main Block
              </option>

              <option value="bin2">
                EcoSort Bin - Library
              </option>

              <option value="bin3">
                EcoSort Bin - Cafeteria
              </option>
            </select>
          </div>


          {/* Submit */}
          <button
            type="button"
            className="mt-8 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Submit Disposal
          </button>


          {/* Points Info */}
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm text-green-700">
              ⭐ You can earn EcoPoints for responsible disposal!
            </p>
          </div>

        </div>

      </div>

    </main>
  );
}