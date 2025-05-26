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
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search students, courses, certificates..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? 'Searching...' : 'No results found.'}
          </CommandEmpty>
          <CommandGroup heading="Results">
            {results.map((result) => {
              const Icon = result.icon;
              return (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelect(result)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {result.subtitle}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
