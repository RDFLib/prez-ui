<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>

/* Base table styles */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  background-color: #fff;
}

/* Table header styles */
.table th {
  background-color: #1159c4;
  color:white;
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid #dee2e6;
  font-weight: bold;
}

/* Table body styles */
.table td {
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
}

/* Zebra striping for rows */
.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Hover effect for rows */
.table tr:hover {
  background-color: #f1f1f1;
}

/* Responsive table container */
.table-responsive {
  overflow-x: auto;
}

/* Optional: Add some padding to the table container */
.table-container {
  padding: 20px;
}
</style>