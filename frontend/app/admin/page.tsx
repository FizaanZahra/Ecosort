export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">

        <a
          href="/"
          className="text-2xl font-bold text-green-700"
        >
          🌱 EcoSort
        </a>

        <div className="flex items-center gap-6">

          <span className="font-medium text-gray-600">
            Admin Panel
          </span>

          <a
            href="/"
            className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
          >
            Logout
          </a>

        </div>

      </nav>


      {/* Content */}
      <div className="mx-auto max-w-7xl px-8 py-10">

        <h2 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          Monitor waste collection, bins and user activity.
        </p>


        {/* Statistics */}
        <div className="mt-8 grid gap-6 md:grid-cols-4">

          {/* Users */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">👥</div>

            <p className="mt-4 text-gray-500">
              Total Users
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-600">
              128
            </h3>
          </div>


          {/* Waste */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">♻️</div>

            <p className="mt-4 text-gray-500">
              Total Waste
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-600">
              245 kg
            </h3>
          </div>


          {/* Bins */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">🗑️</div>

            <p className="mt-4 text-gray-500">
              Total Bins
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-600">
              12
            </h3>
          </div>


          {/* Full Bins */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">⚠️</div>

            <p className="mt-4 text-gray-500">
              Full Bins
            </p>

            <h3 className="mt-1 text-3xl font-bold text-red-500">
              2
            </h3>
          </div>

        </div>


        {/* Bin Monitoring */}
        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

          <h3 className="text-2xl font-bold text-gray-900">
            Bin Monitoring
          </h3>

          <p className="mt-2 text-gray-600">
            Monitor the current fill level of EcoSort bins.
          </p>


          <div className="mt-6 space-y-6">

            {/* Main Block */}
            <div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  Main Block
                </span>

                <span className="font-semibold text-green-600">
                  35%
                </span>
              </div>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-green-500"
                  style={{ width: "35%" }}
                ></div>
              </div>

              <p className="mt-2 text-sm text-green-600">
                Available
              </p>

            </div>


            {/* Library */}
            <div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  Library
                </span>

                <span className="font-semibold text-yellow-600">
                  78%
                </span>
              </div>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-yellow-500"
                  style={{ width: "78%" }}
                ></div>
              </div>

              <p className="mt-2 text-sm text-yellow-600">
                Almost Full
              </p>

            </div>


            {/* Cafeteria */}
            <div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  Cafeteria
                </span>

                <span className="font-semibold text-red-600">
                  95%
                </span>
              </div>

              <div className="mt-2 h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-red-500"
                  style={{ width: "95%" }}
                ></div>
              </div>

              <p className="mt-2 text-sm text-red-600">
                Full - Collection Required
              </p>

            </div>

          </div>

        </div>


        {/* Recent Waste Activity */}
        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

          <h3 className="text-2xl font-bold text-gray-900">
            Recent Waste Activity
          </h3>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-green-50">

                <tr>

                  <th className="px-6 py-4 font-semibold text-gray-700">
                    User
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
                    Points
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr className="border-t">

                  <td className="px-6 py-4">
                    User 1
                  </td>

                  <td className="px-6 py-4 font-medium">
                    Plastic
                  </td>

                  <td className="px-6 py-4">
                    1.5 kg
                  </td>

                  <td className="px-6 py-4">
                    Main Block
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    +20
                  </td>

                </tr>


                <tr className="border-t">

                  <td className="px-6 py-4">
                    User 2
                  </td>

                  <td className="px-6 py-4 font-medium">
                    Paper
                  </td>

                  <td className="px-6 py-4">
                    2 kg
                  </td>

                  <td className="px-6 py-4">
                    Library
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    +15
                  </td>

                </tr>


                <tr className="border-t">

                  <td className="px-6 py-4">
                    User 3
                  </td>

                  <td className="px-6 py-4 font-medium">
                    Glass
                  </td>

                  <td className="px-6 py-4">
                    1 kg
                  </td>

                  <td className="px-6 py-4">
                    Cafeteria
                  </td>

                  <td className="px-6 py-4 font-semibold text-green-600">
                    +25
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* Full Bin Alert */}
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">

          <h3 className="text-xl font-bold text-red-700">
            ⚠️ Collection Alert
          </h3>

          <p className="mt-2 text-red-600">
            Cafeteria bin is 95% full. Collection is required soon.
          </p>

        </div>

      </div>

    </main>
  );
}