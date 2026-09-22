export default function Register() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">
            🌱 EcoSort
          </h1>

          <p className="mt-2 text-gray-600">
            Create your account
          </p>
        </div>


        {/* Register Form */}
        <form className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>


          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>


          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>


          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>


          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Create Account
          </button>

        </form>


        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-green-600 hover:underline"
          >
            Login
          </a>
        </p>

      </div>

    </main>
  );
}