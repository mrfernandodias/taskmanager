import clsx from 'clsx';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>
      <div
        className={clsx(
          'hidden md:flex w-[40vw] h-screen',
          'items-center justify-center overflow-hidden p-8',
          'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700'
        )}
      >
        <div className="text-center text-white space-y-6">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-3xl font-bold">Organize Your Work</h3>
          <p className="text-lg text-blue-100 max-w-md">
            Manage tasks efficiently, collaborate with your team, and achieve your goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
