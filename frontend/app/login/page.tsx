export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">
            🌱 EcoSort
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back!
          </p>
        </div>


        {/* Login Form */}
        <form className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>


          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>


          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Login
          </button>

        </form>


        {/* Register Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-green-600 hover:underline"
          >
            Register
          </a>
        </p>

      </div>

    </main>
  );
}