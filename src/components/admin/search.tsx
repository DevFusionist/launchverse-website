import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, Users, BookOpen, Award, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  scaleIn,
  cardVariants,
} from '@/components/ui/motion';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'student' | 'course' | 'certificate' | 'placement';
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch data from individual endpoints
  const { data: studentsData } = useSWR(
    query
      ? `/api/admin/students?search=${encodeURIComponent(query)}&limit=5`
      : null,
    fetcher
  );
  const { data: coursesData } = useSWR(
    query
      ? `/api/admin/courses?search=${encodeURIComponent(query)}&limit=5`
      : null,
    fetcher
  );
  const { data: certificatesData } = useSWR(
    query
      ? `/api/admin/certificates?search=${encodeURIComponent(query)}&limit=5`
      : null,
    fetcher
  );
  const { data: placementsData } = useSWR(
    query
      ? `/api/admin/placements?search=${encodeURIComponent(query)}&limit=5`
      : null,
    fetcher
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const newResults: SearchResult[] = [];

      // Add student results
      studentsData?.students?.forEach((student: any) => {
        newResults.push({
          id: student.id,
          type: 'student',
          title: student.name,
          subtitle: student.email,
          icon: Users,
        });
      });

      // Add course results
      coursesData?.courses?.forEach((course: any) => {
        newResults.push({
          id: course.id,
          type: 'course',
          title: course.title,
          subtitle: course.description,
          icon: BookOpen,
        });
      });

      // Add certificate results
      certificatesData?.certificates?.forEach((certificate: any) => {
        newResults.push({
          id: certificate.id,
          type: 'certificate',
          title: certificate.code,
          subtitle: `${certificate.student.name} - ${certificate.course.title}`,
          icon: Award,
        });
      });

      // Add placement results
      placementsData?.placements?.forEach((placement: any) => {
        newResults.push({
          id: placement.id,
          type: 'placement',
          title: placement.student.name,
          subtitle: `${placement.position} at ${placement.company.name}`,
          icon: Briefcase,
        });
      });

      setResults(newResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, studentsData, coursesData, certificatesData, placementsData]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    switch (result.type) {
      case 'student':
        router.push(`/admin/students/${result.id}`);
        break;
      case 'course':
        router.push(`/admin/courses/${result.id}`);
        break;
      case 'certificate':
        router.push(`/admin/certificates/${result.id}`);
        break;
      case 'placement':
        router.push(`/admin/placements/${result.id}`);
        break;
    }
  };

  return (
    <div className="relative">
      <MotionDiv
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <Button
          variant="outline"
          className={cn(
            'group relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2',
            'transition-all duration-200',
            'hover:border-primary/20 hover:shadow-md',
            'active:scale-[0.98]'
          )}
          onClick={() => setOpen(true)}
        >
          <Search className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 xl:mr-2" />
          <span className="hidden transition-colors group-hover:text-primary xl:inline-flex">
            Search...
          </span>
          <span className="sr-only">Search</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 transition-colors group-hover:border-primary/20 xl:flex">
            <span className="text-xs transition-colors group-hover:text-primary">
              ⌘
            </span>
            K
          </kbd>
        </Button>
        <div
          className={cn(
            'transition-all duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]'
          )}
        >
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
              placeholder="Search students, courses, certificates..."
              value={query}
              onValueChange={setQuery}
              className={cn(
                'transition-colors duration-200',
                'focus:border-primary/20'
              )}
            />
            <CommandList>
              <CommandEmpty className="text-muted-foreground transition-colors duration-200">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary transition-colors duration-200" />
                  </div>
                ) : (
                  'No results found.'
                )}
              </CommandEmpty>
              {results.length > 0 ? (
                <MotionDiv
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="p-2"
                >
                  {results.map((result) => {
                    const Icon = result.icon;
                    return (
                      <MotionDiv
                        key={`${result.type}-${result.id}`}
                        variants={staggerItem}
                        className={cn(
                          'group/item relative cursor-pointer transition-all duration-200',
                          'flex items-center space-x-2 rounded-md p-2',
                          'hover:bg-accent hover:shadow-sm',
                          'active:scale-[0.98]'
                        )}
                        onClick={() => handleSelect(result)}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover/item:scale-110 group-hover/item:text-primary" />
                        <div className="flex flex-col">
                          <span className="transition-colors duration-200 group-hover/item:text-primary">
                            {result.title}
                          </span>
                          <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover/item:text-primary/80">
                            {result.subtitle}
                          </span>
                        </div>
                        <div className="absolute inset-0 rounded-md opacity-0 ring-1 ring-inset ring-primary/10 transition-opacity duration-200 group-hover/item:opacity-100" />
                      </MotionDiv>
                    );
                  })}
                </MotionDiv>
              ) : null}
            </CommandList>
          </CommandDialog>
        </div>
      </MotionDiv>
    </div>
  );
}
