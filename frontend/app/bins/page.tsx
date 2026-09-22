export default function BinsPage() {
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
          Smart Bin Status
        </h2>

        <p className="mt-2 text-gray-600">
          Check the current status of EcoSort waste bins.
        </p>


        {/* Bin Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* Bin 1 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <span className="text-4xl">🗑️</span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Available
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Main Block
            </h3>

            <p className="mt-1 text-gray-500">
              EcoSort Bin #001
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span>Fill Level</span>
                <span>35%</span>
              </div>

              <div className="mt-2 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[35%] rounded-full bg-green-500"></div>
              </div>
            </div>

          </div>


          {/* Bin 2 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <span className="text-4xl">🗑️</span>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                Almost Full
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Library
            </h3>

            <p className="mt-1 text-gray-500">
              EcoSort Bin #002
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span>Fill Level</span>
                <span>78%</span>
              </div>

              <div className="mt-2 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[78%] rounded-full bg-yellow-500"></div>
              </div>
            </div>

          </div>


          {/* Bin 3 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <span className="text-4xl">🗑️</span>

              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                Full
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Cafeteria
            </h3>

            <p className="mt-1 text-gray-500">
              EcoSort Bin #003
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span>Fill Level</span>
                <span>95%</span>
              </div>

              <div className="mt-2 h-3 rounded-full bg-gray-200">
                <div className="h-3 w-[95%] rounded-full bg-red-500"></div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}