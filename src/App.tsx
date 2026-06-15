import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApiKeyProvider } from '@/context/ApiKeyContext'
import Layout from '@/components/Layout'
import ApiKeyPage from '@/features/apikey/ApiKeyPage'
import AccountPage from '@/features/account/AccountPage'
import CharactersPage from '@/features/characters/CharactersPage'
import WalletPage from '@/features/wallet/WalletPage'
import BankPage from '@/features/bank/BankPage'
import MaterialsPage from '@/features/materials/MaterialsPage'
import InventoryPage from '@/features/inventory/InventoryPage'

export default function App() {
  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/apikey" element={<ApiKeyPage />} />
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/account" replace />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/bank" element={<BankPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/account" replace />} />
        </Routes>
      </BrowserRouter>
    </ApiKeyProvider>
  )
}
