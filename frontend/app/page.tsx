export default function Home() {
  return (
    <main className="min-h-screen bg-green-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-10 py-5 shadow-sm">

        <h1 className="text-2xl font-bold text-green-700">
          🌱 EcoSort
        </h1>

        <div className="flex gap-8 text-gray-700">
          <a href="#home" className="hover:text-green-600">
            Home
          </a>

          <a href="#features" className="hover:text-green-600">
            Features
          </a>

          <a href="#how-it-works" className="hover:text-green-600">
            How It Works
          </a>
        </div>

        <div className="flex gap-3">

          <a
            href="/login"
            className="rounded-lg border border-green-600 px-5 py-2 text-green-600 hover:bg-green-50"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            Register
          </a>

          <a
            href="/admin"
            className="rounded-lg border border-green-600 px-5 py-2 text-green-600 hover:bg-green-50"
          >
            Admin Panel
          </a>

        </div>

      </nav>


      {/* Hero Section */}
      <section
        id="home"
        className="flex min-h-[600px] items-center justify-between px-16"
      >

        <div className="max-w-xl">

          <p className="mb-4 text-lg font-semibold text-green-600">
            🌍 Build a Cleaner Future
          </p>

          <h2 className="text-5xl font-bold leading-tight text-gray-900">
            Smart Waste Management
            <span className="text-green-600"> Made Simple</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            EcoSort helps communities manage waste efficiently,
            monitor smart bins, and encourage responsible waste
            disposal through rewards.
          </p>

          <div className="mt-8 flex gap-4">

            <a
              href="/register"
              className="rounded-lg bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700"
            >
              Get Started
            </a>

            <a
              href="#features"
              className="rounded-lg border border-green-600 px-7 py-3 font-semibold text-green-600 hover:bg-green-100"
            >
              Learn More
            </a>

          </div>

        </div>


        {/* Hero Card */}
        <div className="flex h-80 w-80 items-center justify-center rounded-3xl bg-green-200 shadow-lg">

          <div className="text-center">

            <div className="text-7xl">
              ♻️
            </div>

            <p className="mt-5 text-xl font-semibold text-green-800">
              Sort. Recycle. Reward.
            </p>

          </div>

        </div>

      </section>


      {/* Features Section */}
      <section
        id="features"
        className="bg-white px-16 py-20"
      >

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-semibold text-green-600">
              WHY ECOSORT?
            </p>

            <h2 className="mt-2 text-4xl font-bold text-gray-900">
              Everything You Need for Smarter Waste Management
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              EcoSort combines smart technology and rewarding experiences
              to make waste management easier and more effective.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Card 1 */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">

              <div className="text-4xl">
                ♻️
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Smart Waste Segregation
              </h3>

              <p className="mt-3 text-gray-600">
                Help users properly categorize and dispose of different
                types of waste.
              </p>

            </div>


            {/* Card 2 */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">

              <div className="text-4xl">
                🗑️
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Smart Bin Monitoring
              </h3>

              <p className="mt-3 text-gray-600">
                Monitor the fill level of waste bins using IoT sensors
                and display their current status.
              </p>

            </div>


            {/* Card 3 */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">

              <div className="text-4xl">
                ⭐
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                EcoPoints & Rewards
              </h3>

              <p className="mt-3 text-gray-600">
                Encourage responsible waste disposal by rewarding users
                with EcoPoints.
              </p>

            </div>


            {/* Card 4 */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">

              <div className="text-4xl">
                🔔
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Full-Bin Notifications
              </h3>

              <p className="mt-3 text-gray-600">
                Notify authorities when a waste bin reaches its capacity
                and requires collection.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-green-50 px-16 py-20"
      >

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-semibold text-green-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-4xl font-bold text-gray-900">
              Simple Steps Towards Better Waste Management
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              EcoSort makes responsible waste disposal simple,
              trackable, and rewarding.
            </p>

          </div>


          {/* Steps */}
          <div className="mt-14 grid gap-8 md:grid-cols-4">

            {/* Step 1 */}
            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                1
              </div>

              <div className="mt-4 text-4xl">
                🗑️
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Dispose
              </h3>

              <p className="mt-2 text-gray-600">
                Dispose of your waste through the EcoSort system.
              </p>

            </div>


            {/* Step 2 */}
            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                2
              </div>

              <div className="mt-4 text-4xl">
                ♻️
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Sort
              </h3>

              <p className="mt-2 text-gray-600">
                Waste is categorized into the appropriate waste type.
              </p>

            </div>


            {/* Step 3 */}
            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                3
              </div>

              <div className="mt-4 text-4xl">
                📊
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Monitor
              </h3>

              <p className="mt-2 text-gray-600">
                Smart sensors help monitor the status of waste bins.
              </p>

            </div>


            {/* Step 4 */}
            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                4
              </div>

              <div className="mt-4 text-4xl">
                ⭐
              </div>

              <h3 className="mt-4 text-xl font-bold">
                Earn Rewards
              </h3>

              <p className="mt-2 text-gray-600">
                Earn EcoPoints for responsible waste disposal.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Call To Action */}
      <section className="bg-green-700 px-16 py-20 text-center text-white">

        <h2 className="text-4xl font-bold">
          Ready to Make a Difference?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-green-100">
          Join EcoSort and take a step towards smarter and more
          responsible waste management.
        </p>

        <a
          href="/register"
          className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-green-700 hover:bg-green-50"
        >
          Get Started
        </a>

      </section>


      {/* Footer */}
      <footer className="bg-gray-900 px-16 py-10 text-white">

        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 md:flex-row">

          <div>

            <h2 className="text-2xl font-bold">
              🌱 EcoSort
            </h2>

            <p className="mt-2 max-w-sm text-gray-400">
              Smart waste management for a cleaner and greener future.
            </p>

          </div>


          <div>

            <h3 className="font-semibold">
              Quick Links
            </h3>

            <div className="mt-3 flex flex-col gap-2 text-gray-400">

              <a
                href="#home"
                className="hover:text-white"
              >
                Home
              </a>

              <a
                href="#features"
                className="hover:text-white"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="hover:text-white"
              >
                How It Works
              </a>

            </div>

          </div>

        </div>


        <div className="mx-auto mt-8 max-w-6xl border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © 2026 EcoSort. All rights reserved.
        </div>

      </footer>

    </main>
  );
}