<template>
    <div class="billing-history">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <!-- Başlık -->
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h3 class="text-lg font-medium text-gray-900">Fatura Geçmişi</h3>
              <p class="mt-2 text-sm text-gray-700">
                Son 12 aya ait fatura geçmişiniz
              </p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button 
                @click="downloadAll"
                class="download-button"
              >
                Tümünü İndir
              </button>
            </div>
          </div>
  
          <!-- Fatura Tablosu -->
          <div class="mt-8 flex flex-col">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th v-for="header in headers" :key="header.key" 
                          class="table-header">
                        {{ header.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="invoice in invoices" :key="invoice.id" 
                        class="hover:bg-gray-50">
                      <td class="table-cell">{{ invoice.date }}</td>
                      <td class="table-cell">{{ invoice.description }}</td>
                      <td class="table-cell">{{ formatPrice(invoice.amount) }}</td>
                      <td class="table-cell">
                        <span :class="getStatusClass(invoice.status)">
                          {{ invoice.status }}
                        </span>
                      </td>
                      <td class="table-cell text-right">
                        <button 
                          @click="downloadInvoice(invoice)"
                          class="action-button"
                        >
                          İndir
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { formatPrice } from '@/utils/formatters'
  
  export default {
    name: 'BillingHistory',
    
    props: {
      invoices: {
        type: Array,
        required: true
      }
    },
  
    setup() {
      const headers = [
        { key: 'date', label: 'Tarih' },
        { key: 'description', label: 'Açıklama' },
        { key: 'amount', label: 'Tutar' },
        { key: 'status', label: 'Durum' },
        { key: 'actions', label: '' }
      ]
  
      const getStatusClass = (status) => {
        const classes = {
          paid: 'text-green-800 bg-green-100',
          pending: 'text-yellow-800 bg-yellow-100',
          failed: 'text-red-800 bg-red-100'
        }
        return `inline-flex px-2 py-1 rounded-full text-xs font-semibold ${classes[status]}`
      }
  
      const downloadInvoice = (invoice) => {
        // İndirme işlemi
      }
  
      const downloadAll = () => {
        // Toplu indirme işlemi
      }
  
      return {
        headers,
        getStatusClass,
        downloadInvoice,
        downloadAll,
        formatPrice
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .table-header {
    @apply px-3 py-3.5 text-left text-sm font-semibold text-gray-900;
  }
  
  .table-cell {
    @apply whitespace-nowrap px-3 py-4 text-sm text-gray-500;
  }
  
  .download-button {
    @apply inline-flex items-center justify-center rounded-md border border-transparent 
           bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm 
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 
           focus:ring-offset-2 sm:w-auto;
  }
  
  .action-button {
    @apply text-primary-600 hover:text-primary-900;
  }
  </style>