import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUsers } from "@/lib/react-query/queries";
import { Search, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, Users } from 'lucide-react';

const AllUsers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const usersPerPage = 12;

  const { data: creators, isLoading, isError: isErrorCreators, refetch } = useGetUsers();

  // Filter users based on search query
  const filteredCreators = creators?.documents.filter(creator => 
    creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Sort users
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name?.localeCompare(b.name) 
        : b.name?.localeCompare(a.name);
    } else if (sortBy === "username") {
      return sortOrder === "asc" 
        ? a.username?.localeCompare(b.username) 
        : b.username?.localeCompare(a.username);
    }
    return 0;
  });

  // Paginate users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedCreators.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedCreators.length / usersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    toast({ 
      title: "Refreshing users list",
      description: "The users list is being updated."
    });
  };

  // Toggle sort order


  if (isErrorCreators) {
    return (
      <div className="common-container">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="h3-bold text-center mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-4 text-center">We couldn't load the users list. Please try again later.</p>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-8 gap-4">
          <h2 className="h3-bold md:h2-bold text-left">All Users</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="username-asc">Username (A-Z)</option>
                <option value="username-desc">Username (Z-A)</option>
              </select>
              
              <button 
                onClick={handleRefresh} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Refresh users"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {isLoading && !creators ? (
          <div className="w-full">
            <Loader />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 bg-white shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredCreators.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="h3-bold text-center mb-2">No users found</h3>
            <p className="text-gray-500 text-center">
              {searchQuery 
                ? `No users matching "${searchQuery}"`
                : "There are no users to display yet"}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <ul className="user-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentUsers.map((creator) => (
                <li key={creator?.$id} className="flex-1 min-w-[200px] w-full transition-transform hover:scale-[1.02]">
                  <UserCard user={creator} />
                </li>
              ))}
            </ul>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-10 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show limited page numbers with ellipsis
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-8 h-8 rounded-lg ${
                            currentPage === pageNumber
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === 2 && currentPage > 3) ||
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNumber}>...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="text-center text-gray-500 mt-4 text-sm">
              Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredCreators.length)} of {filteredCreators.length} users
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;