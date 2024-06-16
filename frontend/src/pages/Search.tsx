import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useUsers from "@/hooks/useUsers";
import { Loader } from "@/components/Loader";
import { Link } from "react-router-dom";
import ProfileImg from "@/components/ProfileImg";

const Search: React.FC = () => {
  const { searchProfile } = useUsers();

  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const onSearchProfile = async () => {
    setIsLoading(true);
    const response = await searchProfile(query);

    if (response.success) {
      const data = response?.data;
      setSearchResults(data.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery !== "") {
      onSearchProfile();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="space-y-5">
      <span className="relative">
        <SearchIcon className="text-muted-foreground absolute left-4 top-5 size-5" />
        <Input
          type="text"
          placeholder="Search"
          className="pl-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query.length > 0 && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-5 rounded-full size-4"
            onClick={() => setQuery("")}
          >
            <X className="size-10" />
          </Button>
        )}
      </span>
      {searchResults.length > 0 && (
        <>
          <div className="w-full flex flex-col bg-card min-h-[250px] rounded-lg py-4">
            {isLoading ? (
              <div className="w-full h-[250px] flex items-center justify-center">
                <Loader size={30} stroke={2} />
              </div>
            ) : (
              searchResults.map((result) => (
                <div className="flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/@${result?.username}`}
                      className="flex overflow-hidden gap-3 pl-3 items-center w-full"
                      key={result?._id}
                    >
                      <ProfileImg
                        fallBackText={result?.username}
                        url={result?.profilePic}
                      />
                      <div className="flex flex-col w-[80%]">
                        <span className="pb-3">
                          <h1 className="font-bold text-base truncate">
                            {result?.username}
                          </h1>
                          <p className="font-normal text-muted-foreground text-sm truncate">
                            {result?.name}
                          </p>
                        </span>
                      </div>
                    </Link>
                  </div>
                  <Separator className="ml-14" />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
