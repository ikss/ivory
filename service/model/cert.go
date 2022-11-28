package model

import "github.com/google/uuid"

type CertModel struct {
	FileId   uuid.UUID `json:"fileId"`
	FileName string    `json:"fileName"`
	Path     string    `json:"path"`
}

type CertRequest struct {
	FileName string `json:"fileName"`
}