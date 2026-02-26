import ProfileTab from '@/components/resident/ProfileTab'
import React from 'react'

const page = () => {
  return (
    <div>
        <ProfileTab 
             residentData={residentData}
             isEditing={isEditing}
             handleEditProfile={handleEditProfile}
             handleCancelEdit={handleCancelEdit}
             saveStatus={saveStatus}
             handleSaveProfile={handleSaveProfile}
             editForm={editForm}
             handleInputChange={handleInputChange}
             getUnitNumber={getUnitNumber}
           />
    </div>
  )
}

export default page