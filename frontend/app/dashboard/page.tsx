export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Dashboard Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">

        <h1 className="text-2xl font-bold text-green-700">
          🌱 EcoSort
        </h1>

        <div className="flex items-center gap-6">
          <span className="text-gray-600">
            Welcome, User
          </span>

          <a
            href="/"
            className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50"
          >
            Logout
          </a>
        </div>

      </nav>


      {/* Dashboard Content */}
      <div className="mx-auto max-w-6xl px-8 py-10">

        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h2>

          <p className="mt-2 text-gray-600">
            Track your waste disposal and EcoPoints.
          </p>
        </div>


        {/* Statistics */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* EcoPoints */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">⭐</div>

            <p className="mt-4 text-gray-500">
              EcoPoints
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-600">
              250
            </h3>
          </div>


          {/* Waste Disposed */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">♻️</div>

            <p className="mt-4 text-gray-500">
              Waste Disposed
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-600">
              18 kg
            </h3>
          </div>


          {/* Contributions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-4xl">🌍</div>

            <p className="mt-4 text-gray-500">
              Contributions
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-600">
              24
            </h3>
          </div>

        </div>


        {/* Main Actions */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">

          {/* Waste Disposal */}
          <div className="rounded-2xl bg-green-700 p-8 text-white">

            <div className="text-5xl">
              🗑️
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              Dispose Waste
            </h3>

            <p className="mt-2 text-green-100">
              Record your waste disposal and earn EcoPoints.
            </p>

            <a
              href="/dispose"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-green-700 hover:bg-green-50"
            >
              Dispose Waste
            </a>

          </div>


          {/* Bin Status */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">

            <div className="text-5xl">
              🗑️
            </div>

            <h3 className="mt-5 text-2xl font-bold text-gray-900">
              Nearby Bin Status
            </h3>

            <p className="mt-2 text-gray-600">
              Check the availability of nearby EcoSort bins.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>

              <span className="font-medium text-green-600">
                Bins Available
              </span>
            </div>

            <a
              href="/bins"
              className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              View Bin Status
            </a>

          </div>

        </div>


        {/* Recent Activity */}
        <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm">

          <h3 className="text-2xl font-bold text-gray-900">
            Recent Activity
          </h3>

          <div className="mt-6 space-y-4">

            {/* Plastic Waste */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium text-gray-900">
  Plastic Waste
</p>

                <p className="text-sm text-gray-500">
                  Today
                </p>
              </div>

              <span className="font-semibold text-green-600">
                +20 Points
              </span>
            </div>


            {/* Paper Waste */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium text-gray-900">
  Paper Waste
</p>

                <p className="text-sm text-gray-500">
                  Yesterday
                </p>
              </div>

              <span className="font-semibold text-green-600">
                +15 Points
              </span>
            </div>


            {/* Glass Waste */}
            <div className="flex items-center justify-between">
              <div>
               <p className="font-medium text-gray-900">
  Glass Waste
</p>

                <p className="text-sm text-gray-500">
                  2 days ago
                </p>
              </div>

              <span className="font-semibold text-green-600">
                +25 Points
              </span>
            </div>

          </div>


          {/* Waste History Button */}
          <a
            href="/history"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            View Waste History
          </a>

        </div>

      </div>

    </main>
  );
}