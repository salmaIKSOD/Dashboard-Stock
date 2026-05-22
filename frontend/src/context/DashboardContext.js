// frontend/src/context/DashboardContext.js
import React, { createContext, useContext, useState, useMemo } from 'react';

const DashboardContext = createContext(null);

function getDefaultDates() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return { dateDebut: `${yyyy}-${mm}-01`, dateFin: `${yyyy}-${mm}-${dd}` };
}

const BASE_PAR_DEFAUT = 'BIJOU';

export function DashboardProvider({ children }) {
  const { dateDebut: defaultDebut, dateFin: defaultFin } = getDefaultDates();

  const [tableData, setTableData] = useState(null);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({
    base: BASE_PAR_DEFAUT,
    dateDebut: defaultDebut,
    dateFin: defaultFin,
    depot: null,
    article: null,
    cl_no1: null,
    cl_no2: null,
    cl_no3: null,
    cl_no4: null,
  });

  const value = useMemo(() => ({
    tableData, setTableData,
    hasFiltered, setHasFiltered,
    loading, setLoading,
    error, setError,
    currentFilters, setCurrentFilters,
    defaultDebut, defaultFin,
  }), [tableData, hasFiltered, loading, error, currentFilters, defaultDebut, defaultFin]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}