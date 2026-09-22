export default function HistoryPage() {
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

      {/* Content */}
      <div className="mx-auto max-w-6xl px-8 py-10">

        <h2 className="text-3xl font-bold text-gray-900">
          Waste History
        </h2>

        <p className="mt-2 text-gray-600">
          View your previous waste disposal activities.
        </p>

        {/* History Table */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Waste Type
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Quantity
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Bin
                  </th>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    EcoPoints
                  </th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-t">
                  <td className="px-6 py-4">22 Sep 2026</td>
                  <td className="px-6 py-4 font-medium">Plastic</td>
                  <td className="px-6 py-4">1.5 kg</td>
                  <td className="px-6 py-4">Main Block</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    +20
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="px-6 py-4">21 Sep 2026</td>
                  <td className="px-6 py-4 font-medium">Paper</td>
                  <td className="px-6 py-4">2 kg</td>
                  <td className="px-6 py-4">Library</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    +15
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="px-6 py-4">20 Sep 2026</td>
                  <td className="px-6 py-4 font-medium">Glass</td>
                  <td className="px-6 py-4">1 kg</td>
                  <td className="px-6 py-4">Cafeteria</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    +25
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="px-6 py-4">18 Sep 2026</td>
                  <td className="px-6 py-4 font-medium">Cardboard</td>
                  <td className="px-6 py-4">3 kg</td>
                  <td className="px-6 py-4">Main Block</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    +30
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}