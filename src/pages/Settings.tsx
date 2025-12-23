import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input, TextArea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { BolgenieLogo } from '../components/BolgenieLogo'

export function Settings() {
  const navigate = useNavigate()
  const { userProfile, updateProfile } = useAuth()

  const [formData, setFormData] = useState({
    companyName: userProfile?.companyName || '',
    companyAddress: userProfile?.companyAddress || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setLoading(true)
    await updateProfile(formData)
    setLoading(false)
    navigate('/payment')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-8">
          <BolgenieLogo className="w-12 h-12" />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Setup Your Profile</h1>
          <p className="text-gray-600 mb-6">
            This information will appear on your generated Bills of Lading.
          </p>

          <div className="space-y-4">
            <Input
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your Company LLC"
            />

            <TextArea
              label="Company Address"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              placeholder="123 Main St, City, State 12345"
              rows={3}
            />
          </div>

          <Button
            onClick={handleSave}
            loading={loading}
            className="w-full mt-6"
            disabled={!formData.companyName}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
