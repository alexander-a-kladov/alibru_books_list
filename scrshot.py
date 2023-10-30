#!/usr/bin/python3


import sys
import pytesseract
from PyQt5 import QtCore, QtGui, QtWidgets
from PIL import ImageGrab

class TesserClass():
    @staticmethod
    def readName(img):
        custom_config = r'--oem 3 --psm 6'
        raw_str = pytesseract.image_to_string(img, lang="eng", config=custom_config)
        name = raw_str.replace("\n", " ").replace("\t", " ").strip()
        return name
    @staticmethod
    def readRusName(img):
        custom_config = r'--oem 3 --psm 6'
        raw_str = pytesseract.image_to_string(img, lang="rus", config=custom_config)
        name = raw_str.replace("\n", " ").replace("\t", " ").strip()
        return name


class SnippingWidget(QtWidgets.QMainWindow):
    closed = QtCore.pyqtSignal()
    handler = None
    text = ""

    def __init__(self, parent=None):
        super(SnippingWidget, self).__init__(parent)
        self.setAttribute(QtCore.Qt.WA_NoSystemBackground, True)
        self.setAttribute(QtCore.Qt.WA_TranslucentBackground, True)
        self.setStyleSheet("background:transparent;")
        self.setWindowFlags(QtCore.Qt.FramelessWindowHint)

        self.outsideSquareColor = "red"
        self.squareThickness = 2

        self.start_point = QtCore.QPoint()
        self.end_point = QtCore.QPoint()

    def mousePressEvent(self, event):
        self.start_point = event.pos()
        self.end_point = event.pos()
        self.update()

    def mouseMoveEvent(self, event):
        self.end_point = event.pos()
        self.update()

    def mouseReleaseEvent(self, QMouseEvent):
        r = QtCore.QRect(self.start_point, self.end_point).normalized()
        self.hide()
        img = ImageGrab.grab(bbox=r.getCoords())
        self.text = self.handler(img)
        QtWidgets.QApplication.restoreOverrideCursor()
        self.closed.emit()
        self.start_point = QtCore.QPoint()
        self.end_point = QtCore.QPoint()

    def paintEvent(self, event):
        trans = QtGui.QColor(22, 100, 233)
        r = QtCore.QRectF(self.start_point, self.end_point).normalized()
        qp = QtGui.QPainter(self)
        trans.setAlphaF(0.05)
        qp.setBrush(trans)
        outer = QtGui.QPainterPath()
        outer.addRect(QtCore.QRectF(self.rect()))
        inner = QtGui.QPainterPath()
        inner.addRect(r)
        r_path = outer - inner
        qp.drawPath(r_path)
        qp.setPen(
            QtGui.QPen(QtGui.QColor(self.outsideSquareColor), self.squareThickness)
        )
        trans.setAlphaF(0)
        qp.setBrush(trans)
        qp.drawRect(r)
        
    def setHandler(self, hand):
        self.handler = hand


class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        self.centralWidget = QtWidgets.QWidget()
        self.setCentralWidget(self.centralWidget)

        self.label = QtWidgets.QLineEdit(alignment=QtCore.Qt.AlignCenter)
        self.button = QtWidgets.QPushButton('Скопировать')
        self.button.clicked.connect(self.copyToClipboard)
        self.nameButton = QtWidgets.QPushButton('Считать ENG')
        self.nameButton.clicked.connect(self.activateName)
        self.nameButtonRus = QtWidgets.QPushButton('Считать RUS')
        self.nameButtonRus.clicked.connect(self.activateRusName)
        
        layout = QtWidgets.QVBoxLayout(self.centralWidget)
        layout.addWidget(self.label, 1)
        layout.addWidget(self.button, 2)
        layout.addWidget(self.nameButton, 3)
        layout.addWidget(self.nameButtonRus, 4)
        
        self.snipper = SnippingWidget()
        self.snipper.closed.connect(self.on_closed)

    def copyToClipboard(self):
        c = QtWidgets.QApplication.clipboard()
        if c != None:
            c.setText(self.label.text())
            QtWidgets.QMessageBox.information(self, "Copy to Clipboard", "Copied")
        else:
            QtWidgets.QMessageBox.warning(self, "Error copy to Clipboard", "Clipboard not available")
    
    def activateRusName(self):
        self.snipper.setHandler(TesserClass.readRusName)
        self.snipper.showFullScreen()
        QtWidgets.QApplication.setOverrideCursor(QtCore.Qt.CrossCursor)
        self.hide() 
    
    def activateName(self):
        self.snipper.setHandler(TesserClass.readName)
        self.snipper.showFullScreen()
        QtWidgets.QApplication.setOverrideCursor(QtCore.Qt.CrossCursor)
        self.hide()        

    def on_closed(self):
        self.label.setText(self.snipper.text)
        self.show()
        #self.adjustSize()


if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    w = MainWindow()
    w.resize(400, 300)
    w.show()
    sys.exit(app.exec())
