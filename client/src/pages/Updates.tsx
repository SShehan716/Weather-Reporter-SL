import React, { useState, useEffect } from 'react';
import api from '../api';
import styles from './Updates.module.css';
import Spinner from '../components/Spinner';
import UpdateCard, { Update as AnyUpdate } from '../components/UpdateCard';
import PageHeader from '../components/PageHeader';

// Type definitions for the combined updates are now imported

export default function Updates() {
  const [updates, setUpdates] = useState<AnyUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUpdates = async (page: number) => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/all-updates', {
          params: { page },
        });
        // The raw query returns BigInt for count, ensure fields are correct type
        const formattedUpdates = response.data.updates.map((u: any) => ({
            ...u,
            temperature: u.temperature ? parseFloat(u.temperature) : null,
        }))
        setUpdates(formattedUpdates);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to fetch your updates. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.updatesPage}>
      <PageHeader 
        title="My Updates"
        description="View and manage all the weather and risk updates you have posted."
      />

      {loading && <div className={styles.loading}><Spinner /></div>}
      {error && <div className={styles.error}>{error}</div>}
      
      {!loading && !error && (
        <>
          {updates.length === 0 ? (
            <div className={styles.emptyState}>
              You haven't posted any updates yet.
            </div>
          ) : (
            <div className={styles.updatesGrid}>
              {updates.map(update => (
                <UpdateCard key={`${update.type}-${update.id}`} update={update} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
             <div className={styles.paginationControls}>
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Next
                </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 