export default function CourseLoading() {
  return (
    <div className="bg-neon-background-light dark:bg-neon-background-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Loading skeleton for course header */}
          <div className="h-12 w-3/4 bg-neon-card-light dark:bg-neon-card-dark animate-pulse rounded-lg mb-6" />

          {/* Loading skeleton for course highlights */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-neon-card-light dark:bg-neon-card-dark animate-pulse rounded-lg"
              />
            ))}
          </div>

          {/* Loading skeleton for course overview */}
          <div className="space-y-4 mb-12">
            <div className="h-8 w-1/3 bg-neon-card-light dark:bg-neon-card-dark animate-pulse rounded-lg" />
            <div className="h-24 bg-neon-card-light dark:bg-neon-card-dark animate-pulse rounded-lg" />
          </div>

          {/* Loading skeleton for course sections */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 mb-12">
              <div className="h-8 w-1/3 bg-neon-card-light dark:bg-neon-card-dark animate-pulse rounded-lg" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-32 bg-neon-card-light dark:bg-neon-card-dark animate-pulse rounded-lg"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
